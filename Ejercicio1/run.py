from multiprocessing import cpu_count

from bottle_errorsrest import ErrorsRestPlugin
from utils import (
    sum_divisors,
    check_list
)

from bottle import (
    JSONPlugin,
    get,
    post,
    install,
    request,
    HTTPError,
    HTTPResponse,
    response,
    run)


def apply(self, callback, route):
    """ support return any types """
    dumps = self.json_dumps
    if not self.json_dumps:
        return callback

    def wrapper(*a, **ka):
        try:
            rv = callback(*a, **ka)
        except HTTPResponse as resp:
            rv = resp

        if not isinstance(rv, HTTPResponse):
            tmp = rv
            rv = response.copy(cls=HTTPResponse)
            rv.body = tmp

        if not rv.content_type:
            rv.body = dumps(rv.body)
            rv.content_type = 'application/json'
        return rv
    return wrapper


JSONPlugin.apply = apply


@get('/is_perfect/<num:int>')
def is_perfect(num):
    return sum_divisors(num) == num


@get('/is_abundant/<num:int>')
def is_abundant(num):
    return sum_divisors(num) < num


@get('/is_deficient/<num:int>')
def is_deficient(num):
    return sum_divisors(num) > num


@post('/type_value_list')
def type_value_list():
    try:
        if not isinstance(request.json, list):
            raise HTTPError(400, 'invalid type')

        return check_list(request.json)
    except TypeError:
        raise HTTPError(400, 'all data must be integers')


if __name__ == "__main__":
    # install plugins
    install(ErrorsRestPlugin())
    run(port=4423,
        host="0.0.0.0",
        server="gunicorn",
        workers=2 * cpu_count() + 1,
        worker_class="egg:meinheld#gunicorn_worker",
        quiet=True,
        debug=False,
        timeout=5)
