#include <nan.h>
#include <string>
#include <time.h>
#include "naptcha.h"

using namespace v8;
using namespace cimg_library;

#define SHIFT_STYLE_DIRICHLET 0
#define SHIFT_STYLE_NEUMANN 1
#define SHIFT_STYLE_FOURIER 2
#define NOISE_TYPE_RICIAN 4
#define IMAGE_TYPE_2D 1
#define VECTOR_TUNNEL_RGB 3
#define COLOR_BLACK 255

namespace naptcha_object
{
	std::string Text;
	std::string FileName;
	int Count;
	int Width;
	int Height;
	int Quality;
	int IsJpeg;
  int FontSize;
  int Offset;
  int CharacterSpace;
}

NAN_METHOD(CNaptcha::Generate)
{
  Nan::HandleScope scope;

  naptcha_object::Text = _ToString(info[0]->ToString());
  naptcha_object::FileName = _ToString(info[1]->ToString());
  naptcha_object::Count = info[2]->Int32Value();
  naptcha_object::Width = info[3]->Int32Value();
  naptcha_object::Height = info[4]->Int32Value();
  naptcha_object::Quality = info[5]->Int32Value();
  naptcha_object::IsJpeg = info[6]->Int32Value();
  naptcha_object::FontSize = info[7]->Int32Value();
  naptcha_object::Offset = info[8]->Int32Value();
  naptcha_object::CharacterSpace = info[9]->Int32Value();

  Save();

  info.GetReturnValue().Set(Nan::New(naptcha_object::FileName).ToLocalChecked());
}

int CNaptcha::Save()
{
  std::srand((unsigned)time(NULL));
  const char* cp_text((naptcha_object::Text).c_str());
  const char* cp_name((naptcha_object::FileName).c_str());

  int count(naptcha_object::Count);

  CImg<unsigned char> captcha(
    naptcha_object::Width,
    naptcha_object::Height,
    IMAGE_TYPE_2D,
    VECTOR_TUNNEL_RGB,
    COLOR_BLACK
  ),
  color(3);
  const unsigned char fontColor[][3] = {
    { 224, 102, 102 },
    { 103, 78, 167 },
    { 106, 168, 79 },
    { 67, 67, 67 }
  };
  char letter[2] = { 0 };
  int idx = std::rand() % (sizeof(fontColor) / sizeof(fontColor[0]));
  for (int k = 0; k < count; ++k)
  {
    *letter = cp_text[k];
    int nX = naptcha_object::Offset + naptcha_object::CharacterSpace * k;
    int nY = 0;
    if (*letter)
    {
      captcha.draw_text(
        nX,
        nY,
        letter,
        fontColor[idx],
        0,
        0.7,
        naptcha_object::FontSize
      );
    }
  }

  float fFreq = _Rand(0.15, 0.25), fOffset = _Rand(-1, 1) * 3;
  cimg_forYC(captcha, y, v)
    captcha
      .get_shared_row(y, 0, v)
      .shift((int)(4 * std::sin(fFreq * y + fOffset)), 0, 0, 0, SHIFT_STYLE_FOURIER);

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
