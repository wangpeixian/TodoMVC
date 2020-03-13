from django.shortcuts import render

# Create your views here.

def indexView(request):
    if request.method == "GET":
        return render(request, "index.html", {})