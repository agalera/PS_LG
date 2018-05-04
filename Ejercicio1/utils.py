try:
    from functools import lru_cache
except ImportError:
    # compatibility with python 2.x
    def lru_cache(*args, **kwargs):
        return lambda f: f


@lru_cache(maxsize=None)
def sum_divisors(n):
    total = 0
    for x in range(1, int(n / 2) + 1):
        if n % x == 0:
            total += x

    return total


def type_number(n):
    total = sum_divisors(n)

    if total == n:
        return 'perfect'
    elif total < n:
        return 'deficient'
    return 'abundant'


def check_list(l):
    return [(n, type_number(n)) for n in l]
