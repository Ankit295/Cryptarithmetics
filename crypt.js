
function getelem(a)
{
 return document.getElementById(a);
}

var words = [ getelem("word1"),getelem("word2"),getelem("word3") ];
var response = getelem("answers");
var plus = getelem("operation");
var ADD = 0;
var MUL = 1;
var opstr = "+*";
var op = MUL;
var debugstr = "";
var attempts = 0;
var respstr = "";

var dodebug = false;
dodebug = (document.location.search.indexOf("debug") >= 0)
if (dodebug)
   getelem("answers").style.width = "500px";
  
function debug(s)
{
 if (dodebug) debugstr += s + "\n";
}

function addtoResp(s)
{
 respstr += s + "<br>\n";
}

words[0].focus();

function calc0()
{
   {
    debugstr = "";
    response.innerHTML = "Calculating ...<br>";
    op = plus.value;
    setTimeout("calc1()", 100);
   }
}

var s1;
var s2;
var s3;

var letters = ["", "", "", "", "", "", "", "", "", "" ];
var len = 0;
var mask = 0;
var used = [ ];
var wstart = [ ];
var decode = [ ];
var answers;
var l1, l2, l3;
var count;

function startover()
{
 var i;
 for (i=0;i<10;i++)
   {
    used[i] = false;
    decode[i] = 0;
   }
}

function setup()
{
 len = 0;
 answers = "";
 mask = 0;
 count = 0;
 attempts = 0;
 respstr = "";
 startover();
 var i;
 for (i=0;i<10;i++)
    wstart[i] = false;
}

function calc1()
{
    var st = new Date().getTime();
    calc(response, words[0].value, words[1].value, words[2].value);
    var et = new Date().getTime();
    var et = (et - st);
    addtoResp(attempts + " attempts");
    addtoResp(et + "ms");
    response.innerHTML = respstr;
    if (dodebug) response.innerHTML += debugstr;
}

function calc(response, a, b, c)
{
 setup();
 debug("words: " + a + ", " + b + ", " + c);
 s1 = a.toUpperCase();
 s2 = b.toUpperCase();
 s3 = c.toUpperCase();
 try
 {
 validate(s1);
 validate(s2);
 validate(s3);
 l1 = s1.charAt(s1.length-1);
 l2 = s2.charAt(s2.length-1);
 l3 = s3.charAt(s3.length-1);
 addletter(l1);
 addletter(l2);
 addletter(l3);
 if (s1.length > 1) addletter(s1.charAt(s1.length-2));
 if (s2.length > 1) addletter(s2.charAt(s2.length-2));
 if (s3.length > 1) addletter(s3.charAt(s3.length-2));
 lev4step2 = len-1;
 debug("lev4step2 = " + lev4step2);
 getletters(s1);
 getletters(s2);
 getletters(s3);
 firstletter(s1.charAt(0));
 firstletter(s2.charAt(0));
 firstletter(s3.charAt(0));
 debug("letters: " + letters.join(""));
 debug("wstart: " + wstart);

 var i;
 for (i=(wstart[0] ? 1 : 0); i<10; i++)
    step1(i);
 respstr = 
    (
       (count == 0) ?  "No solutions." 
       : (count > 1) ? (count + " solutions.") 
       : ("Solution is unique.") 
    ) + "<br><br>" + respstr;
 }
 catch(e)
 {
  var s = e.toString();
  var i = s.indexOf("##");
  if(i < 0) i=-2;
  addtoResp (s.substr(i+2));
 }
}

function doop(i, j)
{
 var r = (op == ADD) ? (Number(i) + Number(j)) : i * j;
 debug("doop(" + i + "," + j + opstr.charAt(op) + ") = " + r);
 return r;
}

function validate(s)
{
 var i,j,k;
 k = s.length;
 if (k == 0) throw("##Empty input");
 for (i=0; i<k; i++)
   {
    var c = s.charAt(i);
    if (c < 'A' || c > 'Z')
       throw("##'" +c+ "' is not a letter");
   }
}

function getletters(s)
{
 var i,j,k;
 k = s.length;
 for (i=0;i<k;i++)
    addletter(s.charAt(i));
}

function addletter(c)
{
 var j;
 j = c.charCodeAt(0) - 'A'.charCodeAt(0);
 var bit = 1 << j;
 if ((mask & bit) == 0)
   {
    if (len >= letters.length)
      {
	len++;
	throw ("##Too many letters: " + len);
      }
    else
      {
	letters[len] = c;
	len++;
	mask |= bit;
      }
   }
}

function firstletter(c)
{
 var i;
 for (i=0; i<10; i++)
   {
    if (letters[i] == c)
      {
       wstart[i] = true;
       break;
      }
   }
}

function step1(i)
{
 debug("step1: " + i);
 //startover();
 var j,k;
 if (l1 == l2)
   {
    k = doop(i,i) % 10;
    if (l1 == l3)	// ...i + ...i = ...i
      {
       if ((k == i))
	  {
	   used[i] = true;
	   decode[0] = i;
	   check(1);
	   used[i] = false;
	  }
      }
    else  // ...i + ...i = ...j
      {
       if (k == i) return;
       j = k;
	  {
	   used[i] = used[j] = true;
	   decode[0] = i;
	   decode[1] = j;
	   debug("used: " + used);
	   check(2);
	   used[i] = used[j] = false;
	  }
      }
   } // l1 == l2
 else // l1 != l2
   {
    if (l1 == l3)	// ...i + ...j = ...i
      {
       for (j=(wstart[1] ? 1 : 0); j<10; j++)
	if (i != j && doop(i,j) % 10 == i)
	  {
	   used[i] = used[j] = true;
	   decode[0] = i;
	   decode[1] = j;
	   check(2);
	   used[i] = used[j] = false;
	  }
      }
    else if (l2 == l3)	// ...i + ...j = ...j
      {
       for (j=(wstart[1] ? 1 : 0); j<10; j++)
	if (i != j && doop(i,j) % 10 == j)
	  {
	   used[i] = used[j] = true;
	   decode[0] = i;
	   decode[1] = j;
	   check(2);
	   used[i] = used[j] = false;
	  }
      }
    else // ...i + ...j = ...k
      {
       for (j=0; j<10; j++)
	  {
	   if (i != j && !(j==0 && wstart[1]))
	     {
	      k = doop(i,j) % 10;
	      if (k != i && k != j && !(k == 0 && wstart[2]))
	        {
		 used[i] = used[j] = used[k] = true;
		 decode[0] = i;
		 decode[1] = j;
		 decode[2] = k;
		 check(3);
		 used[i] = used[j] = used[k] = false;
		}
	      //else debug("ktest failed: " + i + "," + j + "," + k);
	     }
	   //else debug("jtest failed: " + i + ", " + j);
	  }
      }
   } // l1 != l2
}

function check(lev)
{
 debug("check " + lev + " " + wstart[lev]);
 var i, j, k;
 var n1a, n2a, n3a;
 var s1a, s2a, s3a;
 for (i= (wstart[lev] ? 1 : 0); i<10; i++)
   {
    if (used[i]) debug("lev " + lev + ": " + i + " is used");
    if (used[i]) continue;
   {
     decode[lev] = i;
     if (lev == lev4step2)
       {
	debug("step2 check: " + i);
        n1a = Number(subst(s1.substr(-2)));
        n2a = Number(subst(s2.substr(-2)));
        n3a = Number(subst(s3.substr(-2)));
	debug("Candidates: " + n1a + "," + n2a + " =? " + n3a);
	if (doop(n1a, n2a) % 100 == n3a)
	  {
	   used[i] = true;
	   check(lev+1);
	   used[i] = false;
	  }
        else
	   continue;
       }
     else if (lev >= len-1)
       {
	n1a = Number(subst(s1));
	n2a = Number(subst(s2));
	n3a = Number(subst(s3));
	
	attempts++;
	if (doop(n1a, n2a) == n3a)
	{
	  s1a = String(n1a);
	  s2a = String(n2a);
	  s3a = String(n3a);
	  while (s1a.length < s3a.length) s1a = " " + s1a;
	  while (s2a.length < s3a.length) s2a = " " + s2a;
	  while (s1.length < s3.length) s1 = " " + s1;
	  while (s2.length < s3.length) s2 = " " + s2;

	  var t="";
	  for (k=0;k<len;k++) t+=letters[k];
	  t += " = ";
	  for (k=0;k<len;k++) t+=decode[k];

	  count++;
	  answers = 
	     t + "\n" +
	     "  " + s1 + "\t" + s1a + "\n" +
	     
	     opstr.charAt(op) + " <u>" + s2 + "\t" + s2a + "</u>\n" +
	     //"__________\n" +
	     "  " + s3 + "\t" + s3a;
	  //if (count == 0) addtoResp ("");
	  addtoResp (answers);
	  debug("solution " + count);
	}
	//addtoResp("?");
	if (lev > len-1) return;
	//addtoResp("keep going " + lev + " " + i);
       }
     else
       {
	used[i] = true;
	check(lev+1);
	used[i] = false;
       }
   }
   }
} // check

function subst(s)
{
 var t = 0;
 var i,j,k,l;
 l = s.length;
 for (i = 0; i < l; i++)
   {
    var c = s.charAt(i);
    for (j=0; j<len; j++)
      {
       if (c == letters[j]) 
	  {
	   t = t*10 + decode[j];
	   //if (t == 0) return 1999999999; // no leading 0's
	  }
      }
   }
 debug ("subst(" + s + ") = " + t);
 return t;
}

