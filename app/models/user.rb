class User < ApplicationRecord
  has_many :ratings, dependent: :destroy

  has_many :favorites, dependent: :destroy
  has_many :favorite_dishes, through: :favorites, source: :dish

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
end
