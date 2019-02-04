import random

for i in range(1,15):
    s  = random.randint(1,11)
    t  = random.sample(range(1, 15), s )

    print(t)