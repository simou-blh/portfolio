from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import EmailMessage
from .models import ContactMessage
import json



@csrf_exempt
def send_mail_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            name = data.get("name")
            email = data.get("email")
            message = data.get("message")
            
            if not (name and email and message):
                return JsonResponse({"success": False, "error": "Missing fields"})
            

             # 1. Save in database
            ContactMessage.objects.create(
                name=name,
                email=email,
                message=message,
            )


            mail = EmailMessage(
                subject=f"New contact from {name}",
                body=f"From: {name} <{email}>\n\nMessage:\n{message}",
                from_email="ouassimboulouh30@gmail.com",
                to=["ouassimboulouh30@gmail.com"],
                headers={"Reply-To": email},
            )
            mail.send(fail_silently=False)

            return JsonResponse({"success": True, "message": "Email sent!"})
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)})
    return JsonResponse({"success": False, "error": "Invalid request"})
