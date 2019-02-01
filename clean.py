import re

f = open("testing_dataset.txt", "r")

with open("testing_dataset.csv", "w") as output_file:
    for line in f:
        line = re.sub('\[$', ']', line)
        output_file.write(line)
        print(line)