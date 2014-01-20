"""
This file demonstrates two different styles of tests (one doctest and one
unittest). These will both pass when you run "manage.py test".

Replace these with more appropriate tests for your application.
"""


from django.test import TestCase
from django.test.client import Client


class ThemeHandler(TestCase):
    def test_delete(self):
        """
        """
        c = Client()
        response = c.delete('/theme', {'id': '?'})
        self.failUnlessEqual(response.status_code, 200)
