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
#include "CImg.h"

using namespace v8;

class CNaptcha
{
public:
  static NAN_METHOD(Generate);
  static int Save();

protected:
  inline static std::string _ToString(Local<Value> pLocalValue)
  {
    String::Utf8Value utf8_value(pLocalValue->ToString());
    std::string value = *utf8_value;
    return value;
  };
  inline static double _Rand(const double min, const double max)
  {
    const double val = (double)std::rand() / RAND_MAX;
    return min + (max - min) * val;
  };

private:
  CNaptcha() {};
  ~CNaptcha() {};
};

#endif
