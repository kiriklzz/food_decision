class Rating < ApplicationRecord
  belongs_to :user
  belongs_to :dish

  validates :score, inclusion: { in: 1..5 }
  validates :user_id, uniqueness: { scope: :dish_id }
end
