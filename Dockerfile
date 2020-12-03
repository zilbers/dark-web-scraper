FROM python:3.7

ADD requirements.txt /app/requirements.txt
RUN pip install -U pip
RUN pip install -U -r /app/requirements.txt

ADD /scraper/wait_for_it.sh /app/wait_for_it.sh
RUN chmod +x /app/wait_for_it.sh
EXPOSE 80

COPY ./scraper /app
