require 'net/http'
require 'json'
require 'uri'
require 'time'
require 'fileutils'

begin
  require 'dotenv/load'
rescue LoadError
  # dotenv not available in production or standalone envs
end

module Jekyll
  class RaindropGenerator < Generator
    safe true
    priority :high

    CACHE_DURATION = 86_400 # 24 hours in seconds (1 day)

    def generate(site)
      begin
        token = ENV['RAINDROP_TOKEN']
        collection_id = ENV['RAINDROP_COLLECTION_ID'] || '0' # 0 is 'All'

      cache_dir = File.join(site.source, '.jekyll-cache')
      cache_file = File.join(cache_dir, 'raindrop_cache.json')
      cache_data = nil
      raindrops = nil

      # Check if valid cache exists (< 24 hours old)
      if File.exist?(cache_file)
        begin
          cache_data = JSON.parse(File.read(cache_file))
          cache_time = cache_data['cached_at'] ? Time.parse(cache_data['cached_at']) : Time.at(0)

          if Time.now - cache_time < CACHE_DURATION
            raindrops = cache_data['items'] || []
            Jekyll.logger.info "RaindropGenerator:", "Using cached Raindrop bookmarks from #{cache_time.strftime('%Y-%m-%d %H:%M:%S')} (#{raindrops.size} items)."
          else
            Jekyll.logger.info "RaindropGenerator:", "Cache is older than 24 hours. Refreshing from Raindrop API..."
          end
        rescue StandardError => e
          Jekyll.logger.warn "RaindropGenerator:", "Failed to read cache file: #{e.message}"
        end
      end

      # If cache is missing or expired, fetch from API
      if raindrops.nil?
        if token.nil? || token.empty?
          if cache_data && cache_data['items']
            raindrops = cache_data['items']
            Jekyll.logger.warn "RaindropGenerator:", "RAINDROP_TOKEN missing, but using existing cache (#{raindrops.size} items)."
          else
            Jekyll.logger.warn "RaindropGenerator:", "RAINDROP_TOKEN is missing. Skipping Raindrop sync."
            return
          end
        else
          Jekyll.logger.info "RaindropGenerator:", "Fetching bookmarks from Raindrop.io (Collection: #{collection_id})..."

          begin
            fetched_items = []
            page = 0
            per_page = 50

            loop do
              uri = URI.parse("https://api.raindrop.io/rest/v1/raindrops/#{collection_id}?page=#{page}&perpage=#{per_page}")
              request = Net::HTTP::Get.new(uri)
              request["Authorization"] = "Bearer #{token}"
              request["Content-Type"] = "application/json"

              response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
                http.request(request)
              end

              if response.code == "200"
                data = JSON.parse(response.body)
                items = data['items'] || []
                break if items.empty?

                fetched_items.concat(items)
                page += 1
              else
                Jekyll.logger.error "RaindropGenerator:", "Failed to fetch from Raindrop (Page: #{page}). Code: #{response.code}, Body: #{response.body}"
                break
              end
            end

            if fetched_items.any?
              raindrops = fetched_items
              FileUtils.mkdir_p(cache_dir)
              File.write(cache_file, JSON.pretty_generate({
                'cached_at' => Time.now.iso8601,
                'collection_id' => collection_id,
                'items' => raindrops
              }))
              Jekyll.logger.info "RaindropGenerator:", "Cache saved to #{cache_file} (#{raindrops.size} items)."
            elsif cache_data && cache_data['items']
              raindrops = cache_data['items']
              Jekyll.logger.warn "RaindropGenerator:", "No items fetched. Using previous cache (#{raindrops.size} items)."
            else
              raindrops = []
            end
          rescue StandardError => e
            Jekyll.logger.error "RaindropGenerator:", "Error fetching from Raindrop: #{e.message}"
            if cache_data && cache_data['items']
              raindrops = cache_data['items']
              Jekyll.logger.warn "RaindropGenerator:", "Falling back to previous cache (#{raindrops.size} items)."
            else
              raindrops = []
            end
          end
        end
      end

      # Map Raindrop data to our suggestions format
      mapped_suggestions = (raindrops || []).map do |item|
        {
          "title" => item['title'],
          "url" => item['link'],
          "description" => item['excerpt'],
          "tags" => item['tags'],
          "category" => determine_category(item),
          "created" => item['created'],
          "cover" => item['cover']
        }
      end

      # Merge with existing suggestions if any
      existing = site.data['suggestions'] || []
      all_suggestions = (mapped_suggestions + existing).uniq { |s| s['url'] }

      # Sort by date descending
      site.data['suggestions'] = all_suggestions.sort_by { |s| s['created'] || '0000-00-00' }.reverse

      Jekyll.logger.info "RaindropGenerator:", "Successfully synced and sorted #{site.data['suggestions'].size} items."
      rescue StandardError => e
        Jekyll.logger.error "RaindropGenerator:", "Error fetching from Raindrop: #{e.message}"
      end
    end

    private

    def determine_category(item)
      # Simple logic to map domain/tags to categories used in the site
      link = item['link'].downcase
      tags = item['tags'].map(&:downcase)

      if link.include?('github.com')
        'github'
      elsif link.include?('youtube.com') || link.include?('youtu.be')
        'youtube'
      elsif link.include?('instagram.com')
        'instagram'
      elsif link.include?('wikipedia.org') || link.include?('wiktionary.org')
        'wikipedia'
      elsif tags.include?('article') || tags.include?('blog')
        'blog'
      else
        'web'
      end
    end
  end
end
