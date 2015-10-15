/*
 #  File        : naptcha.h ( C++ header file )
 #  Author      : lukywong@gmail.com
 #  Description : A simple program for generating captcha.
 #  License     : MIT
*/

#ifndef __NODE_CAPTCHA_H
#define __NODE_CAPTCHA_H

#include <node.h>
#include <string>

using namespace v8;

class CNaptcha
{
public:
  static void Generate(const FunctionCallbackInfo<Value>& args);
  static int Save();

protected:
  static std::string _ToString(Local<Value> pLocalValue);

private:
  CNaptcha();
  ~CNaptcha();
};

#endif
