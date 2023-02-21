FROM python:3.8.2

ENV PYTHONBUFFERED 1
ENV PYTHONWRITEBYTECODE 1

RUN apt-get update \
    && apt-get install -y netcat

ENV APP=/app

# Change the workdir.
WORKDIR ${APP}

# Install the requirements
COPY server/requirements.txt requirements.txt
COPY server/. .


RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy the rest of the files
#COPY $SRVR/* $APP/*

EXPOSE 8000

ENTRYPOINT ["python"]

CMD ["manage.py", "runserver", "0.0.0.0:8000"]

#CMD ["gunicorn", "--bind", ":8000", "--workers", "3", "djangobackend.wsgi"]
