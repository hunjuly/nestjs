#! /bin/sh
set -e
cd "$(dirname "$0")"

mysql() (
    MYSQL_CONTAINER="$(basename $WORKSPACE_ROOT).mysql"

    docker rm -f $MYSQL_CONTAINER
    docker volume rm -f $MYSQL_CONTAINER

    # --platform linux/amd64 \
    docker run \
        -d --name ${MYSQL_CONTAINER} --network vscode \
        -p ${TYPEORM_PORT}:${TYPEORM_PORT} \
        -e MYSQL_ROOT_PASSWORD=${TYPEORM_PASSWORD} \
        --mount source="${MYSQL_CONTAINER}",target=/var/lib/mysql,type=volume \
        mysql

    i=0
    while [ $i -lt 60 ]; do
        set +e
        found=$(docker logs ${MYSQL_CONTAINER} 2>&1 | grep -c "socket: '/var/run/mysqld/mysqld.sock'  port: ${TYPEORM_PORT}")
        set -e

        if [ $found -gt 0 ]; then
            docker exec ${MYSQL_CONTAINER} mysql -p$TYPEORM_PASSWORD -e "drop database if exists ${TYPEORM_DATABASE};create database ${TYPEORM_DATABASE};"

            #
            echo 'mysql booting success.('$i's)'
            echo ""
            echo "---- MYSQL CLI ----"
            echo "docker exec -it $MYSQL_CONTAINER mysql -p$TYPEORM_PASSWORD"
            echo "docker exec -it $MYSQL_CONTAINER mysqldump --no-data --skip-comments -u root -p$TYPEORM_PASSWORD --all-databases >create.sql"
            echo "-------------------"
            echo ""
            return 0
        else
            echo "wait for booting...$i"

            i=$(($i + 1))
            sleep 1s
        fi
    done

    echo 'mysql booting failed.'
    docker logs ${MYSQL_CONTAINER}
    return 1
)

redis() (
    REDIS_CONTAINER="$(basename $WORKSPACE_ROOT).redis"

    docker rm -f $REDIS_CONTAINER
    docker volume rm -f $REDIS_CONTAINER

    docker run \
        -d --name ${REDIS_CONTAINER} --network vscode \
        -p ${REDIS_PORT}:${REDIS_PORT} \
        --mount source="${REDIS_CONTAINER}",target=/data,type=volume \
        redis

    sleep 2s

    found=$(docker logs ${REDIS_CONTAINER} 2>&1 | grep -c "Ready to accept connections")

    if [ $found -gt 0 ]; then
        echo 'redis ready.'
        echo ""
        echo "---- REDIS CLI ----"
        echo "docker run --rm -it --network vscode redis redis-cli -h $REDIS_CONTAINER"
        echo "keys *"
        echo "get (key)"
        echo "-------------------"
        echo ""
    else
        echo 'redis booting failed.'
        docker logs ${REDIS_CONTAINER}
        exit 1
    fi
)

. .env.docker

mysql
redis

mkdir -p ../logs
chmod 777 ../logs

cp .env.docker ../.env
