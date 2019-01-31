import re

f = open("testing_dataset.txt", "r")

with open("dataset.txt", "w") as output_file:
    for line in f:
        line = re.sub('$', '@', line)
        output_file.write(line)
