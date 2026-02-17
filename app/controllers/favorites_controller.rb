class FavoritesController < ApplicationController
  before_action :authenticate_user!

  def index
    @favorites = current_user.favorites.includes(dish: :ratings).order(created_at: :desc)
    @total = @favorites.size

    dish_ids = @favorites.filter_map(&:dish_id)

    # Count favorites per theme
    @fav_by_theme = @favorites.group_by { |f| f.dish&.theme }
                              .transform_values(&:count)
                              .compact

    # Most favorited theme
    @top_theme = @fav_by_theme.max_by { |_, v| v }&.first

    # User's own ratings for favorited dishes
    @my_ratings_map = dish_ids.any? ?
      current_user.ratings.where(dish_id: dish_ids).index_by(&:dish_id) : {}

    # Global average rating across all favorited dishes
    @avg_fav_rating = dish_ids.any? ?
      Rating.where(dish_id: dish_ids).average(:score)&.to_f&.round(2) : nil

    # How many favorited dishes have been rated by the user
    @rated_count = @my_ratings_map.size

    # Top favorite by global average rating
    @top_rated_fav = @favorites.max_by { |f| f.dish&.average_rating.to_f }

    # Earliest and latest favorites
    @first_favorited_at = @favorites.last&.created_at
    @last_favorited_at  = @favorites.first&.created_at
  end
end
