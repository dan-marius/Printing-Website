from flask import Flask

from config import Config


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    from app.main import bp as main_bp
    app.register_blueprint(main_bp)

    from app.shop import bp as shop_bp
    app.register_blueprint(shop_bp, url_prefix='/shop')

    return app
