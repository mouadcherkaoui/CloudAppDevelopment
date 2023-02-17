FROM django:onbuild

ENV PYTHONBUFFERED 1
ENV PYTHONWRITEBYTECODE 1

RUN apt-get update \
    && apt-get install -y netcat

ENV APP=/app

# Change the workdir.
WORKDIR ${APP}

# Install the requirements
COPY ./server/requirements.txt $APP
COPY ./server/. .

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy the rest of the files

EXPOSE 8000

RUN chmod +x /app/manage.py
ENTRYPOINT ["python","/app/manage.py", "runserver"]

CMD ["runserver", "0.0.0.0:8000"]

#CMD ["gunicorn", "--bind", ":8000", "--workers", "3", "djangobackend.wsgi"]
