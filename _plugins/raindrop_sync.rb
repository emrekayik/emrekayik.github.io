require 'net/http'
require 'json'
require 'uri'

module Jekyll
  class RaindropGenerator < Generator
    safe true
    priority :high

    def generate(site)
      token = ENV['RAINDROP_TOKEN']
      collection_id = ENV['RAINDROP_COLLECTION_ID'] || '0' # 0 is 'All'

      if token.nil? || token.empty?
        Jekyll.logger.warn "RaindropGenerator:", "RAINDROP_TOKEN is missing. Skipping Raindrop sync."
        return
      end

      Jekyll.logger.info "RaindropGenerator:", "Fetching bookmarks from Raindrop.io (Collection: #{collection_id})..."

      begin
        uri = URI.parse("https://api.raindrop.io/rest/v1/raindrops/#{collection_id}?perpage=50")
        request = Net::HTTP::Get.new(uri)
        request["Authorization"] = "Bearer #{token}"
        request["Content-Type"] = "application/json"

        response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
          http.request(request)
        end

        if response.code == "200"
          data = JSON.parse(response.body)
          raindrops = data['items'] || []
          
          # Map Raindrop data to our suggestions format
          mapped_suggestions = raindrops.map do |item|
            {
              "title" => item['title'],
              "url" => item['link'],
              "description" => item['excerpt'],
              "tags" => item['tags'],
              "category" => determine_category(item),
              "created" => item['created']
            }
          end

          # Merge with existing suggestions if any
          existing = site.data['suggestions'] || []
          all_suggestions = (mapped_suggestions + existing).uniq { |s| s['url'] }
          
          # Sort by date descending
          site.data['suggestions'] = all_suggestions.sort_by { |s| s['created'] || '0000-00-00' }.reverse
          
          Jekyll.logger.info "RaindropGenerator:", "Successfully synced and sorted #{site.data['suggestions'].size} items."
        else
          Jekyll.logger.error "RaindropGenerator:", "Failed to fetch from Raindrop. Code: #{response.code}, Body: #{response.body}"
        end
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
      elsif tags.include?('article') || tags.include?('blog')
        'web'
      else
        'web'
      end
    end
  end
end
