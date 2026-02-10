class RatingsController < ApplicationController
  before_action :authenticate_user!

  def index
    @ratings = current_user.ratings.includes(:dish).order(created_at: :desc)

    @total = @ratings.size
    @your_avg = current_user.ratings.average(:score)&.to_f

    @avg_by_theme = Dish.joins(:ratings)
                        .where(ratings: { user_id: current_user.id })
                        .group(:theme)
                        .average("ratings.score")
                        .transform_values { |v| v&.to_f }

    @count_by_theme = Dish.joins(:ratings)
                          .where(ratings: { user_id: current_user.id })
                          .group(:theme)
                          .count("ratings.id")

    @global_by_theme = Dish.joins(:ratings)
                           .group(:theme)
                           .average("ratings.score")
                           .transform_values { |v| v&.to_f }

    @latest = @ratings.limit(12)
  end
end
