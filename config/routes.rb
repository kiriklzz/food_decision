Rails.application.routes.draw do
  get "ratings/index"
  scope "(:lang)", lang: /ru|en/ do
    devise_for :users

    authenticated :user do
      root "decisions#index", as: :authenticated_root
    end

    root to: redirect("/users/sign_in")

    resources :ratings, only: [:index]

    namespace :api do
      get  "/dishes/next", to: "dishes#next"
      post "/ratings",    to: "ratings#create"
    end
  end
end
