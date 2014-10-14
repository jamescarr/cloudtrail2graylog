FROM zapier/node.js:0.1.2

ADD . /srv/app

RUN cd /srv/app && npm install .

CMD node /srv/app/app.js
