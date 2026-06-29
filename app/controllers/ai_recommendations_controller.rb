class AiRecommendationsController < ApplicationController
  before_action :authenticate_user!

  def create
    recommendation = FoodAssistantService.new(params[:message]).call

    render json: { recommendation: recommendation }
  rescue FoodAssistantService::Error => e
    render json: { error: e.message }, status: :unprocessable_entity
  rescue StandardError => e
    render json: { error: e.message }, status: :unprocessable_entity
  end
end
