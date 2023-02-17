FROM python:3.8.2

ENV PYTHONBUFFERED 1
ENV PYTHONWRITEBYTECODE 1

RUN apt-get update \
    && apt-get install -y netcat

ENV APP=/app
ENV SRVR=/server

# Change the workdir.
WORKDIR ${SRVR}

# Install the requirements
COPY ${SRVR}/requirements.txt $APP
COPY . $APP/

WORKDIR ${APP}

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy the rest of the files
#COPY $SRVR/* $APP/*

EXPOSE 8000

RUN chmod +x /app/manage.py
ENTRYPOINT ["python","/app/manage.py", "runserver"]

CMD ["runserver", "0.0.0.0:8000"]

#CMD ["gunicorn", "--bind", ":8000", "--workers", "3", "djangobackend.wsgi"]
