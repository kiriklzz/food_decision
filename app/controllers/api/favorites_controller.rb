module Api
  class FavoritesController < ApplicationController
    before_action :authenticate_user!

    def toggle
      dish_id = params[:dish_id]
      fav = Favorite.find_by(user: current_user, dish_id: dish_id)

      if fav
        fav.destroy!
        render json: { ok: true, favorited: false }
      else
        Favorite.create!(user: current_user, dish_id: dish_id)
        render json: { ok: true, favorited: true }
      end
    rescue ActiveRecord::RecordInvalid => e
      render json: { ok: false, error: e.message }, status: :unprocessable_entity
    end
  end
end
