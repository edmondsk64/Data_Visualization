import re

f = open("new.csv", "r")

with open("edmond_temp.csv", "w") as output_file:
    for line in f:
        #line = re.sub('\,$', ',[]', line)
        output_file.write(line)
