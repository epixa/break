.PHONY : all clean

all:
	npm install
	mkdir build

clean:
	rm -rf node_modules
	rm -rf build
