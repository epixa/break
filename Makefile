.PHONY : all clean

all:
	npm install
	mkdir -p build

clean:
	rm -rf node_modules
	rm -rf build
