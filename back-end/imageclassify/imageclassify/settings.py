from pathlib import Path
import django_heroku
import os

def env(key: str, default = None):
    if isinstance(default, bool):
        return os.environ.get(key, str(default)) == "True"
    return os.environ.get(key, default)


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env("SECRET_KEY", "django-insecure-me3&#2i(5f5_w6gth01xf%y-ws7x=nsc76lh(n#2dn03ef4b03-a=image-classify")

# SECURITY WARNING: don't run withenv("DEBUG") debug turned on in production!
DEBUG = env("DEBUG", "True") != "False"

ALLOWED_HOSTS = env("ALLOWED_HOSTS", "*").split(';')

CSRF_TRUSTED_ORIGINS = [host for host in env("CSRF_TRUSTED_ORIGINS", "").split(';') if host]


# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # third party packages
    'django_cleanup.apps.CleanupConfig',
    'corsheaders',
    'rest_framework',
    'storages',
    # internal apps
    'api',
    'ai_models',
    'predictions',
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    'whitenoise.middleware.WhiteNoiseMiddleware',
    "django.contrib.sessions.middleware.SessionMiddleware",
    'corsheaders.middleware.CorsMiddleware',
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "imageclassify.urls"

CORS_URLS_REGEX = r'^/api/.*'
CORS_ORIGIN_ALLOW_ALL = env("CORS_ORIGIN_ALLOW_ALL", False)
# CORS_ALLOW_CREDENTIALS False because it has no authentication
CORS_ALLOW_CREDENTIALS = env("CORS_ALLOW_CREDENTIALS", False)
CORS_ALLOWED_ORIGINS = [host for host in env("CORS_ALLOWED_ORIGINS", "").split(';') if host.startswith("http://") or host.startswith("https://")]

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "imageclassify.wsgi.application"


# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': env("DB_NAME"),
        'USER': env("DB_USER"),
        'PASSWORD': env("DB_PASSWORD"),
        'HOST': env("DB_HOST"),
        'PORT': env("DB_PORT"),
    }
}

# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

# The absolute path to the directory where collectstatic will collect static files for deployment.
STATIC_ROOT = BASE_DIR / 'staticfiles'

# The URL to use when referring to static files (where they will be served from)
STATIC_URL = '/static/'

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# AWS configuration

USE_AWS = env("USE_AWS", False)

if USE_AWS:
    AWS_ACCESS_KEY_ID = env("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY = env("AWS_SECRET_ACCESS_KEY")
    AWS_STORAGE_BUCKET_NAME = env("AWS_STORAGE_BUCKET_NAME")
    AWS_S3_CUSTOM_DOMAIN = '%s.s3.amazonaws.com' % AWS_STORAGE_BUCKET_NAME
    AWS_S3_FILE_OVERWRITE = False

    # Use AWS S3 for static file storage
    DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3StaticStorage'
    STATICFILES_STORAGE = 'storages.backends.s3boto3.S3StaticStorage'
else:
    # Use Whitenoise for static file serving
    STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Heroku settings
django_heroku.settings(locals())
