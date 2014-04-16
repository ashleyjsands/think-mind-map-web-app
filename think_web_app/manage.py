#!/usr/bin/env python
import os
import sys

if __name__ == "__main__":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "think_web_app.settings")

    from django.core.management import execute_from_command_line

    import think.server as server
    server.initialise_server()

    execute_from_command_line(sys.argv)
