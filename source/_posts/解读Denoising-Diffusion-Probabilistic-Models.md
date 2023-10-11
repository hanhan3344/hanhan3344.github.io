---
title: 解读Denoising Diffusion Probabilistic Models
date: 2023-10-11 22:06:08
tags: 
  - 多模态
  - DDPM
  - diffusion
categories: 
  - 多模态
top_img: https://images.weserv.nl/?url=https://cdn.jsdelivr.net/gh/hanhan3344/pic/note_pic/elysia05.jpg&default=https://cdn.jsdelivr.net/gh/hanhan3344/pic/note_pic/elysia05.jpg
cover: https://raw.githubusercontent.com/hanhan3344/pic/master/note_pic/20231011221152.png
---

# 一、DDPM在做什么

如果你想做一个文生图模型，给一段文字再随便给一张图（比如噪声），该模型就能帮你产出**符合文字描述**的**逼真**图片。文字描述就像一个指引（guidance），帮助模型去产生更符合语义信息的图片。但语义学习是复杂的，我们可以先退一步，让模型拥有**产生逼真图片的能力**。
比如，我们先给模型喂一堆cyberpunk风格的图片，让模型学会cyberpunk风格的分布信息，然后喂给模型一个随机噪音，就能让模型产生一张逼真的cyberpunk照片。或者给模型喂一堆人脸照片，让模型产生一张逼真的人脸。同样，我们也能选择给训练好的模型喂带点信息的图片，比如一张夹杂噪音的人脸，让模型帮我们去噪

![https://cdn.jsdelivr.net/gh/hanhan3344/pic/note_pic/20231011162842.jpg](https://cdn.jsdelivr.net/gh/hanhan3344/pic/note_pic/20231011162842.jpg)

具备了产出逼真图片的能力，模型才可能在下一步去学习语义信息（guidance）。**DDPM的本质作用，是学习训练数据的分布，产出尽可能符合训练数据分布的真实图片。**所以，它也称为后续文生图类扩散模型框架的基石。

# 二、DDPM训练流程

总的来说，DDPM的训练过程分为两步：

- Diffsion Process（又称为Forward Process）
- Denoise Process（又被称为Reverse Process）

如何让模型学习训练数据的分布呢？
一个简单的想法是，使用一张干净的图，每一步（timestep）都往上加一点噪音，然后在每一步中，都让模型去找到加噪前图片的样子，即让模型学会**去噪**。这样训练完毕后，再给模型塞入一个纯噪声，它不就能一步步帮我还原出原始图片的分布了吗？
**一步步加噪的过程，被称为Diffusion Process一步步去噪的过程，就被称为Denoise Process**

## 2.1 Diffusion Process

Diffusion Process的命名收到热力学中分子扩散的启发：分子从高浓度区域扩散至低浓度区域，直至整个系统处于平衡。加噪过程也是同理，每次往图片上加一些噪声，直至图片变为一个纯噪声为止。整个过程如下：

![https://cdn.jsdelivr.net/gh/hanhan3344/pic/note_pic/20231011164254.jpg](https://cdn.jsdelivr.net/gh/hanhan3344/pic/note_pic/20231011164254.jpg)

如图所示，我们进行了1000步加噪，每一步我们都往图片上加入一个高斯分布噪声，直到图片变为一个纯高斯分布的噪声。我们记：

- $T$：总步数
- $x_0,x_1,...x_T$：每一步产生的图片。其中 为原始图片， $x_T$ 为纯高斯噪声
- $\epsilon\sim N(0,I)$：为每一步添加的高斯噪声
- $q(x_t|x_{t-1})$： $x_t$ 在条件 $x=x_{t-1}$ 下的概率分布。

那么根据以上流程图，我们有： $x_t=x_{t-1}+\epsilon=x_0+\epsilon_0+\epsilon_1+...+\epsilon$
根据公式，为了知道 $x_t$ ，需要sample好多次噪声，感觉不太方便，能不能更简化一些呢

### 重参数

我们知道随着步数的增加，图片中原始信息含量越少，噪声越多，我们可以分别给原始图片和噪声一个权重来计算 $x_t$ ：

- $\bar{\alpha}_1,\bar{\alpha}_2,...,\bar{\alpha}_T$：**一系列常数，类似于超参数，随着$T$的增加越来越小**

此时$x_t$的计算可以设计成：$x_t=\sqrt{\bar{\alpha_t}}x_0+\sqrt{1-\bar{\alpha_t}}\epsilon$。现在，**我们只需要sample一次噪声，就可以直接从$x_0$得到$x_t$了。**

再深入一些，$\bar{\alpha}_1,\bar{\alpha}_2,...,\bar{\alpha}_T$并不是我们直接设定的超参数，而是根据其他参数推导而来的，这个“其他超参数”指：

- $\beta_1,\beta_2,...,\beta_T$：**一系列常数，是我们直接设定的超参数，随着T的增加越来越大**

则$\bar{\alpha}$和$\beta$的关系可以表示为：

$\alpha_t=1-\beta_t$

$\bar{\alpha_t}=\alpha_1\alpha_2\ldots\alpha_t$

这样**从原始加噪到$\beta,\alpha$加噪，再到$\bar{\alpha}$加噪，使得$q(x_t|x_{t-1})$转换成$q(x_t|x_0)$的过程，**就被称为**重参数（Reparameterization）**

## 2.2 Denoise Process

Denoise Process的过程与Diffusion Process恰好相反：给定$x_t$，让模型把它还原到$x_{t-1}$，这里我们用$p(x_{t-1}|x_t)$来表示去噪过程。由于加噪过程只是按照设定好的超参数向前加噪，并不经过模型，而去噪过程是真正训练并使用模型的过程，所以我们用$p_{\theta}(x_{t-1}|x_t)$来表示去噪过程，$\theta$表示模型参数。即：

$q(x_t|x_{t-1})$：用来表示Diffusion Process

$p_{\theta}(x_{t-1}|x_t)$：用来表示Denoise Process

我们再来看看去噪模型做了什么事。如图所示，从第$T$个timestep开始，模型的输入为$x_t$与当前timestep $t$。模型中蕴含一个噪声预测器（UNet），该预测器会根据当前的输入预测出噪声，然后将图片减去预测出的噪声，就可以得到去噪后的图片。重复这个过程，直到还原出原始图片$x_0$为止：

![https://raw.githubusercontent.com/hanhan3344/pic/master/note_pic/20231011200134.png](https://raw.githubusercontent.com/hanhan3344/pic/master/note_pic/20231011200134.png)

这里就有两个（至少）疑惑：

- **为什么我们的输入要包含timestep？**

  由于模型每一步去噪都是用的同一个模型，所以我们需要告诉模型现在进行的是哪一步去噪，因此我们要引入timestep。

- **为什么通过预测噪声的方式，就能让模型学得训练数据的分布，从而产生逼真的图片？**

  我们知道DDPM的优化目标是：**使得生成的图片尽可能符合训练数据分布。**基于这个目标我们记：

  - $P_\theta(x)$：模型所产生的图片的（概率）分布。其中$\theta$表示模型参数。
  - $P_{data}(x)$：训练数据（也可理解为真实世界）图片的（概率）分布。其中data表示这是一个自然世界客观存在的分布，与模型无关。

  则我们的优化目标如图：

  ![https://raw.githubusercontent.com/hanhan3344/pic/master/note_pic/20231011201441.png](https://raw.githubusercontent.com/hanhan3344/pic/master/note_pic/20231011201441.png)

  让$P_\theta(x)$和$P_{data}(x)$两个分布尽可能相似。而求两个分布的相似性，则可以想到**KL散度。**现在我们的目标函数就变为：$argmin_\theta KL(P_{data}||P_\theta)$。

  我们利用KL散度的公式对目标函数做一些变换：

  ![https://raw.githubusercontent.com/hanhan3344/pic/master/note_pic/20231011202240.png](https://raw.githubusercontent.com/hanhan3344/pic/master/note_pic/20231011202240.png)

  可以**将优化目标变为求$argmax_\theta\Pi_{i=1}^{m}P_\theta(x_i)$**

  ![https://raw.githubusercontent.com/hanhan3344/pic/master/note_pic/20231011202905.png](https://raw.githubusercontent.com/hanhan3344/pic/master/note_pic/20231011202905.png)

  回顾：在Diffusion Process中，我们不过模型，随timestep的变化给图片加噪$(x_{t-1}\rightarrow x_t)$。在Denoise Process中，我们经过模型，对图片进行去噪$(x_t\rightarrow x_{t-1})$。**Diffusion过程中遵循的分布记为$q$，Denoise过程中遵循的分布，记为$p_\theta$。**

  现在我们可以继续拆解$logP_\theta(x)$：

  ![https://raw.githubusercontent.com/hanhan3344/pic/master/note_pic/20231011203356.png](https://raw.githubusercontent.com/hanhan3344/pic/master/note_pic/20231011203356.png)

  $E_{q_\phi(z|x)}[log\frac{P_\theta(x,z)}{q_\phi(z|x)}]$被称为Evidence Lower Bound（ELBO）。至此，我们将最大化$logP_\theta(x)$拆解为最大化ELBO。

  该式描述的是一个timestep下的优化目标，但我们的模型有$T$个timestep，因此还需进一步扩展成链式表达的方式。这里，为了更符合我们对扩散模型的理解，我们不再使用$z$变量，将其用$x_0,x_1,\ldots,x_T$来表示：$logP_\theta(x)\geq E_{q_\phi(x_1:x_T|x_0)}log\frac{P_\theta(x_0:x_T)}{q_\phi(x_1:x_T|x_0)}$

  继续拆解：

  ![https://raw.githubusercontent.com/hanhan3344/pic/master/note_pic/20231011204427.png](https://raw.githubusercontent.com/hanhan3344/pic/master/note_pic/20231011204427.png)

  其中prior matching term可看作是常量，reconstruction term和denoising matching term则是和模型密切相关的两项。由于两者十分相似，接下来只需特别关注denoising matching term如何拆解即可。

  ![https://raw.githubusercontent.com/hanhan3344/pic/master/note_pic/20231011210742.png](https://raw.githubusercontent.com/hanhan3344/pic/master/note_pic/20231011210742.png)

  接下来我们来看$q(x_t|x_{t-1}),\ q(x_{t-1}|x_0),\ q(x_t|x_0)$长什么样。同时，我们已经知道（最初假设）$x_0,x_{t-1},x_t,\epsilon$都服从高斯分布，根据高斯分布的性质，我们有：

  ![https://raw.githubusercontent.com/hanhan3344/pic/master/note_pic/20231011211030.png](https://raw.githubusercontent.com/hanhan3344/pic/master/note_pic/20231011211030.png)

  对于高斯分布，知道了均值和方差，我们就可以把它的概率密度函数写出来：

  ![https://raw.githubusercontent.com/hanhan3344/pic/master/note_pic/20231011211349.png](https://raw.githubusercontent.com/hanhan3344/pic/master/note_pic/20231011211349.png)

  一顿推导后，我们将$q(x_{t-1}|x_t,x_0)$的分布写出来了，也就是我们当前优化目标$\Sigma_{t=2}^TE_{q(x_t|s_0)}[D_{KL}(q(x_{t-1}|x_t,x_0)||p_\theta(x_{t-1}|x_t))]$中q的部分。现在我们再看$p_\theta(x_{t-1}|x_t)$部分，根据优化目标，我们需要让$p$和$q$的分布尽量接近：

  ![https://raw.githubusercontent.com/hanhan3344/pic/master/note_pic/20231011211934.png](https://raw.githubusercontent.com/hanhan3344/pic/master/note_pic/20231011211934.png)

  而让$p$和$q$的分布接近，等价于让$\mu_\theta\rightarrow\mu_q,\sigma_\theta\rightarrow\sigma_q$。注意到$\sigma_q$其实是一个常量，只和我们设置的超参数有关。**在DDPM中，为了简化优化过程，并且使训练更稳定，就假设$\sigma_\theta$也按此种方式固定下来。在DDPM中，只预测均值。**

  于是我们再对$\mu_q$做改写，根据diffusion规则，将$x_0$用$x_t$表示：

  ![https://raw.githubusercontent.com/hanhan3344/pic/master/note_pic/20231011212854.png](https://raw.githubusercontent.com/hanhan3344/pic/master/note_pic/20231011212854.png)

  可以看出，上式的结果在diffusion过程中就已决定。所以对于$p_\theta(x_{t-1}|x_t)$，我只需让它在denoise过程中预测出$\epsilon_\theta$，使得$\epsilon_\theta\rightarrow\epsilon$，然后令：

  $x_{t-1}=\frac{1}{\sqrt{\alpha_t}}(x_t-\frac{1-\alpha_t}{\sqrt{1-\bar{\alpha_t}}}\epsilon_\theta)+\sigma_qz\ \ \ \ (z\sim N(0,I))$

  **这样，我们就能使得$p_\theta(x_t-1|x_t)$和$q(x_{t-1}|x_t,x_0)$的分布一致。**

  **也就是说，只要在denoise的过程中，让模型去预测噪声，就可以达到“让模型产生图片的分布”和“真实世界的图片分布”逼近的目的。**

# 三、DDPM的Training与Sampling过程

![https://raw.githubusercontent.com/hanhan3344/pic/master/note_pic/20231011213901.png](https://raw.githubusercontent.com/hanhan3344/pic/master/note_pic/20231011213901.png)

在training过程中，我们只需要去预测噪声，就能在数学上使得模型学到的分布和真实的图片分布不断逼近。

- 从训练数据中，抽样出一条$x_0$
- 随机抽样出一个timestep
- 随机抽样出一个噪声
- 计算：$loss=\epsilon-\epsilon_\theta(\sqrt{\bar{\alpha_t}}x_0+\sqrt{1-\bar{\alpha_t}}\epsilon,t)$
- 计算梯度，更新模型，重复上述过程

而当我们使用模型去做sampling，即测试模型能生成什么样的图片时，我们可由

$x_{t-1}=\frac{1}{\sqrt{\alpha_t}}(x_t-\frac{1-\alpha_t}{\sqrt{1-\bar{\alpha_t}}}\epsilon_\theta)+\sigma_qz\ \ \ \ (z\sim N(0,I))$

从$x_t$推导$x_{t-1}$，甚至还原出$x_0$。

DDPM的核心运作方法已经讲完了，接下来我们看DDPM用于预测噪声的核心模型：UNet。

# 四、DDPM中的UNet架构

总的来说，UNet分为两个部分：

- Encoder
- Decoder

**在Encoder部分中，UNet模型会逐步压缩图片的大小；在Decoder部分中，则会逐步还原图片的大小。**同时在Encoder和Decoder间，还会使用**“残差连接”**，确保Decoder部分在推理和还原图片信息时，不会丢失掉之前步骤的信息。整体示意图如下，因为压缩再放大过程形似U字，因此被称为UNet：

![https://raw.githubusercontent.com/hanhan3344/pic/master/note_pic/20231011215038.png](https://raw.githubusercontent.com/hanhan3344/pic/master/note_pic/20231011215038.png)

DDPM中的UNet是什么样子？我们假设输入一张32*32*3大小的图片，看一下DDPM UNet运作的完整流程：

![https://raw.githubusercontent.com/hanhan3344/pic/master/note_pic/20231011215314.png](https://raw.githubusercontent.com/hanhan3344/pic/master/note_pic/20231011215314.png)

同层间只做channel上的变化，不同层间做图片的压缩处理。至于每一层channel怎么变，层间size如何调整，就取决于实际训练中对模型的设定了。Decoder层也是同理。

## 4.1 DownBlock和UpBlock

![https://raw.githubusercontent.com/hanhan3344/pic/master/note_pic/20231011215731.png](https://raw.githubusercontent.com/hanhan3344/pic/master/note_pic/20231011215731.png)

TimeEmbedding层采用和Transformer一致的三角函数位置编码，将常数转变为向量。Attention层则是沿着channel维度将图片拆分为token，做完attention后再重新组装成图片。

**虚线部分即为“残差连接”（Residual Connection）**，而残差连接之上引入的**虚线框Conv的意思是**，如果in_c = out_c，则对in_c做一次卷积，使得其通道数等于out_c后，再相加；否则将直接相加

## 4.2 DownSample和UpSample

![https://raw.githubusercontent.com/hanhan3344/pic/master/note_pic/20231011215913.png](https://raw.githubusercontent.com/hanhan3344/pic/master/note_pic/20231011215913.png)

就是**压缩(Conv)**和**放大(ConvT)**图片的过程。

## 4.3 MiddleBlock

![https://raw.githubusercontent.com/hanhan3344/pic/master/note_pic/20231011220017.png](https://raw.githubusercontent.com/hanhan3344/pic/master/note_pic/20231011220017.png)

和DownBlock与UpBlock的过程相似，不再赘述。
