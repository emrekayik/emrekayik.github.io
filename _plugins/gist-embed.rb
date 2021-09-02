module Jekyll
    class EmbedGist < Liquid::Tag
  
      def initialize(tag_name, url, tokens)
        super
        # remove spaces from string:
        @url = url.gsub!(/\s+/, '')
      end
  
      def render(context)
        "<script src=\"#{@url}.js\"></script>"
      end
    end
  end
  
  Liquid::Template.register_tag('gist', Jekyll::EmbedGist)