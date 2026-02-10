class ApplicationController < ActionController::Base
  before_action :set_locale

  private

  def set_locale
    I18n.locale = params[:lang].presence_in(%w[ru en]) || :ru
  end

  def default_url_options
    { lang: I18n.locale }
  end
end
