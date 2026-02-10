class Dish < ApplicationRecord
  has_many :ratings, dependent: :destroy

  validates :title, presence: true
  validates :theme, presence: true
  validates :image_url, presence: true

  # Средняя экспертная оценка
  def average_rating
    ratings.average(:score)&.round(2)
  end
end
