************************** MUST USE DOCKER V5.7,,,,,***********************************
This works on 2018 MacBook oct 2018:
docker run --name mydockerMySq1 -d -v /Users/c023490/dockerdata/mysql-data:/var/lib/mysql:rw  -p 9010:3306 -e "MYSQL_ROOT_PASSWORD=mypassword" mysql:5.7
