/*
 #  File        : naptcha.h ( C++ header file )
 #  Author      : lukywong@gmail.com
 #  Description : A simple program for generating captcha.
 #  License     : MIT
*/

#ifndef __NODE_CAPTCHA_H
#define __NODE_CAPTCHA_H

#include <nan.h>
#include <string>

using namespace v8;

class CNaptcha
{
public:
  static NAN_METHOD(Generate);
  static int Save();

protected:
  static std::string _ToString(Local<Value> pLocalValue);

private:
  CNaptcha();
  ~CNaptcha();
};

#endif
