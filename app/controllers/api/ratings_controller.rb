module Api
  class RatingsController < ApplicationController
    before_action :authenticate_user!

    def create
      rating = Rating.find_or_initialize_by(user: current_user, dish_id: params[:dish_id])
      rating.score = params[:score].to_i

      if rating.save
        render json: { ok: true, score: rating.score }
      else
        render json: { ok: false, errors: rating.errors.full_messages }, status: :unprocessable_entity
      end
    end
  end
end
