import re

f = open("test_data.json", "r")

with open("test_data_new.json", "w") as output_file:
    for line in f:
        #line = re.sub('\,$', ',[]', line)
        output_file.write(line)
