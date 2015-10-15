#include <nan.h>
#include <string>
#include <time.h>
#include <iostream>
#include "naptcha.h"
#include "CImg.h"

using namespace v8;
using namespace cimg_library;

#define SHIFT_STYLE_DIRICHLET 0
#define SHIFT_STYLE_NEUMANN 1
#define SHIFT_STYLE_FOURIER 2
#define NOISE_TYPE_RICIAN 4

namespace naptcha_object
{
	std::string Text;
	std::string FileName;
	int Count;
	int Width;
	int Height;
	int Offset;
	int Quality;
	int IsJpeg;
  int FontSize;
}

CNaptcha::CNaptcha() { }
CNaptcha::~CNaptcha() { }

NAN_METHOD(CNaptcha::Generate)
{
  Nan::HandleScope scope;

  naptcha_object::Text = _ToString(info[0]->ToString());
  naptcha_object::FileName = _ToString(info[1]->ToString());
  naptcha_object::Count = info[2]->Int32Value();
  naptcha_object::Width = info[3]->Int32Value();
  naptcha_object::Height = info[4]->Int32Value();
  naptcha_object::Offset = info[5]->Int32Value();
  naptcha_object::Quality = info[6]->Int32Value();
  naptcha_object::IsJpeg = info[7]->Int32Value();
  naptcha_object::FontSize = info[8]->Int32Value();

  Save();

  info.GetReturnValue().Set(Nan::New(naptcha_object::FileName).ToLocalChecked());
}

int CNaptcha::Save()
{
  std::srand((unsigned)time(NULL));
  const char* cp_text((naptcha_object::Text).c_str());
  const char* cp_name((naptcha_object::FileName).c_str());

  int count(naptcha_object::Count);
  int offset(naptcha_object::Offset);

  CImg<unsigned char> captcha(
    naptcha_object::Width,
    naptcha_object::Height,
    1, //2D Image
    3, //vector tunnel, here is RGB
    255  //init color black
  ),
  color(3);
  const unsigned char fontColor[][3] = {
    { 224, 102, 102 },
    { 103, 78, 167 },
    { 106, 168, 79 },
    { 67, 67, 67 }
  };
  char letter[2] = { 0 };
  for (int k = 0; k < count; ++k)
  {
    CImg<unsigned char> tmpCImg(
      naptcha_object::Width,
      naptcha_object::Height,
      1, //2D Image
      3, //vector tunnel, here is RGB
      255  //init color black
    );
    *letter = cp_text[k];
    if (*letter)
    {
      int idx = std::rand() % (sizeof(fontColor) / sizeof(fontColor[0]));
      tmpCImg.draw_text(
        (int)(2 + 8 * cimg::rand()),
        (int)(12 * cimg::rand()),
        letter,
        fontColor[idx],
        0,
        0.7,
        naptcha_object::FontSize
      ).resize(-100, -100, 1, 3);

      float fFreq = cimg::rand(0.15, 0.25), fOffset = cimg::rand(-1, 1) * 3;
      cimg_forYC(tmpCImg, y, v)
        tmpCImg
          .get_shared_row(y, 0, v)
          .shift((int)(4 * std::sin(fFreq * y + fOffset)), 0, 0, 0, SHIFT_STYLE_FOURIER);

      captcha.draw_image(count + offset * k, tmpCImg);
    }
  }

  for (int l = 0; l < 3; ++l)
  {
    for (int k = 0; k < 10; ++k)
    {
      cimg_forX(color,i) color[i] = (unsigned char)(std::rand() % 255);
      captcha.draw_line(
        (int)(cimg::rand() * captcha.width()),
        (int)(cimg::rand() * captcha.height()),
        (int)(cimg::rand() * captcha.width()),
        (int)(cimg::rand() * captcha.height()),
        color.data(),
        0.8f
      );
    }
  }
  captcha.noise(30, NOISE_TYPE_RICIAN);

  if(naptcha_object::IsJpeg)
  {
    captcha.save_jpeg(cp_name, naptcha_object::Quality);
  }
  else
  {
    captcha.save_bmp(cp_name);
  }

  return 0;
}

std::string CNaptcha::_ToString(Local<Value> pLocalValue)
{
  String::Utf8Value utf8_value(pLocalValue->ToString());
  std::string value = *utf8_value;
  return value;
}
