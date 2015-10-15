#include <nan.h>
#include "naptcha.h"

using namespace v8;

NAN_MODULE_INIT(Init)
{
  Nan::Set(
    target,
    Nan::New("generate").ToLocalChecked(),
    Nan::GetFunction(Nan::New<FunctionTemplate>(CNaptcha::Generate)).ToLocalChecked()
  );
}

NODE_MODULE(naptcha, Init)
