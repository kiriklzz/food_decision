Rails.application.routes.draw do
  namespace :api do
  get  "/dishes/next", to: "dishes#next"
  post "/ratings",    to: "ratings#create"
end
  devise_for :users

  authenticated :user do
    root "decisions#index", as: :authenticated_root
  end

  root to: redirect("/users/sign_in")
end
