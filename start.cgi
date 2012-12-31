#!/usr/bin/python

import subprocess
import cPickle as pickle
import os.path

print "Content-type:text/html\r\n\r\n"

fname = "save.p"

if os.path.isfile(fname):
	isRunning = pickle.load(open(fname,"rb"))
	print '%s-%s<br>'%(1,isRunning)
else:
	isRunning = False
	pickle.dump( isRunning, open( fname, "wb" ) )
	print 2

if not isRunning:
	isRunning = True
	print 3
	pickle.dump( isRunning, open( fname, "wb" ) )
	subprocess.Popen("nohup /usr/local/bin/node app.js >> server.log &", shell=True)
	#subprocess.Popen("ls -l >> server.log", shell=True)

url = "http://localhost:8888/nodejs%20game/start.cgi2"
print """<meta http-equiv="refresh" content="1;url=%s">
    <script language="javascript">
        window.location.href = "%s"
    </script>"""%(url,url)
    
#	isRunning = False

#pickle.dump( isRunning, open( fname, "wb" ) )
#print 4

#print '<html>'
#print '<body>'
#print '<br>Result-%s'%isRunning
#print '</body>'
#print '</html>'



