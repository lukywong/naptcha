#include <node.h>
#include "naptcha.h"

using namespace v8;

void Init(Local<Object> target)
{
  NODE_SET_METHOD(target, "generate", CNaptcha::Generate);
}

NODE_MODULE(naptcha, Init)
