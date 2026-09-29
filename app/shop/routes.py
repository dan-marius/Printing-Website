from app.shop import bp


@bp.route('/')
def catalog():
    return "Shop catalog"
