docker build . -t node_server 

docker run -p 4000 --name node_server -it node_server