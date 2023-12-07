#!/bin/sh

# start cron
/usr/sbin/crond -f -l 8

# Run Node
cd opt/trainingcenter_backend && npm run run