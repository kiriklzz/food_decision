class FoodAssistantService
  class Error < StandardError; end

  def initialize(message)
    @message = message.to_s.strip
  end

  def call
    raise ArgumentError, "Message can't be blank" if message.blank?

    response = RubyLLM.chat(
      model: RubyLLM.config.default_model,
      provider: :ollama,
      assume_model_exists: true
    ).with_instructions(
      "Ты помощник по выбору еды. Дай короткую, практичную рекомендацию на русском языке."
    ).ask(message)

    response.respond_to?(:content) ? response.content.to_s : response.to_s
  rescue RubyLLM::Error => e
    raise Error, e.message
  end

  private

  attr_reader :message
end
