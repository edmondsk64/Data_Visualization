import re

f = open("small_dataset.csv", "r")

with open("edmond_temp.csv", "w") as output_file:
    for line in f:
        output_file.write(line)

    for i in range(103, 999):
        line = '%s,""\n' %(i)
        output_file.write(line)