FROM python:3.7

ADD requirements.txt /app/requirements.txt
RUN pip install -U pip
RUN pip install -U -r /app/requirements.txt

# ADD /app/wait_for_it.sh /app/app/wait_for_it.sh
# RUN chmod +x /app/app/wait_for_it.sh

COPY ./app /app
