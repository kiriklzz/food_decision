class RatingsController < ApplicationController
  before_action :authenticate_user!

  def index
    @ratings = current_user.ratings.includes(:dish).order(created_at: :desc)

    @avg_by_theme = Dish.joins(:ratings)
                        .where(ratings: { user_id: current_user.id })
                        .group(:theme)
                        .average("ratings.score")
  end
end
