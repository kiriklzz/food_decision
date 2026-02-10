module Api
  class DishesController < ApplicationController
    before_action :authenticate_user!

    def next
      theme = params[:theme].to_s
      theme = "" if theme == "random"
      scope = theme.present? ? Dish.where(theme: theme) : Dish.all

      dish = scope.order(Arel.sql("RANDOM()")).first
      return render json: { dish: nil, message: "No dishes for this theme" } if dish.nil?

      my_rating = Rating.find_by(user: current_user, dish: dish)&.score
      is_favorite = Favorite.exists?(user: current_user, dish: dish)

      render json: {
        dish: {
          id: dish.id,
          title: dish.title,
          theme: dish.theme,
          image_url: dish.image_url,
          average_rating: dish.average_rating,
          is_favorite: is_favorite
        },
        my_rating: my_rating
      }
    end
  end
end
