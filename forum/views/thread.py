from django import forms
from django.conf import settings
from django_mako_plus.controller import view_function, RedirectException
from django.http import HttpResponse, HttpResponseRedirect, Http404
from management import models as mmod
from lib.filters import *
from forum import models as fmod
from . import templater, prepare_params



@view_function
def process_request(request):
  # check user permissions and prepare the params
  params = prepare_params(request)
  
  # get the thread the user is after
  try:
    thread = fmod.Thread.objects.get(pk=request.urlparams[0])
  except (fmod.Thread.DoesNotExist, ValueError, TypeError):
    raise RedirectException('/forum/')

  # handle the form
  comment_form = CommentForm()
  if request.method == 'POST':
    comment_form = CommentForm(request.POST)
    if comment_form.is_valid():
      comment = fmod.Comment(user=request.user, thread=thread)
      comment.comment = comment_form.cleaned_data['comment']
      comment.save()
      return HttpResponseRedirect('/forum/thread/%s#comment_%s' % (thread.pk, comment.pk))  # redirect so the user doesn't accidentally post again by hitting refresh
  
  # render the template
  params['comment_form'] = comment_form
  params['thread'] = thread
  params['comments'] = thread.comments.order_by('created')
  return templater.render_to_response(request, 'thread.html', params)
  
@view_function
def vote(request):
  # handle vote button
  thread = fmod.Thread.objects.get(id=request.urlparams[2])
  comment = fmod.Comment.objects.get(id=request.urlparams[1])
  try: 
    existingVoteTicket = fmod.VoteTicket.objects.get(user=request.user, comment=comment)
    if request.urlparams[0] == 'like':    
      if existingVoteTicket.thumbs_up == True:
        print('>>>>Nothing')
      else:
        comment.vote = comment.vote + 1
        comment.save()
        existingVoteTicket.thumbs_up = True
        existingVoteTicket.save()
    elif request.urlparams[0] == 'nlike':
      if existingVoteTicket.thumbs_up == True:
        comment.vote = comment.vote - 1
        comment.save()
        existingVoteTicket.thumbs_up = False
        existingVoteTicket.save()
      else:
        print('>>>>Nothing')

  except fmod.VoteTicket.DoesNotExist:
    if request.urlparams[0] == 'like':    
      voteTicket = fmod.VoteTicket(user=request.user, comment=comment, thumbs_up=True)
      voteTicket.save()
      comment.vote = comment.vote + 1
      comment.save()
    elif request.urlparams[0] == 'nlike':
      voteTicket = fmod.VoteTicket(user=request.user, comment=comment, thumbs_up=False)
      voteTicket.save()
      comment.vote = comment.vote - 1
      comment.save()
  
  return HttpResponseRedirect('/forum/thread/%s#comment_%s' % (thread.id, comment.id))
  
class CommentForm(forms.Form):
  '''Form to post new comment'''
  comment = forms.CharField(max_length=4000, required=True, widget=forms.Textarea(attrs={'class': 'form-control', 'style': 'width: 100%; height: 94px;'}))

